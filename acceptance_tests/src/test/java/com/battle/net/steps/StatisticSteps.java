package com.battle.net.steps;

import com.battle.net.model.Statistic;
import com.battle.net.service.StatisticService;
import com.battle.net.utils.Container;

import org.junit.Assert;

import cucumber.api.DataTable;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class StatisticSteps {

    private Container container;

    public StatisticSteps(Container container) {
        this.container = container;
    }

    @When("^Setting game \"([^\"]*)\" results for user \"([^\"]*)\"$")
    public void settingGameResultsForUser(String appName, String userName, DataTable data) {
        log.debug("Set  results for game {} for user {} ", appName, userName);
        Statistic statistic = data.asList(Statistic.class).get(0);
        String userToken = container.userMap.get(userName).getToken();
        container.response =
            StatisticService.setGameResults(userToken, container.gameMap.get(appName).getAppToken(), statistic);
    }

    @Then("^Game results set$")
    public void gameResultsSet() {
        Assert.assertTrue(container.response.as(Boolean.class));
    }
}
